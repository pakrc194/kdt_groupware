package vfive.gw.board.controller;

import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import vfive.gw.board.di.PageInfo;
import vfive.gw.board.dto.BoardPrvc;
import vfive.gw.board.mapper.BoardMapper;

@RestController
@RequestMapping("/board")
@CrossOrigin(origins = "http://192.168.0.36:3000")
public class BoardController {
	
    @Autowired
    private BoardMapper boardMapper;
    
    /* 게시판 목록 조회 (페이징, 검색 포함) */
    @GetMapping("{sideId}")
    public ResponseEntity<Map<String,Object>> getBoards(
    		PageInfo pInfo) {
        
    	System.out.println("요청받은 게시판 아이디: " + pInfo);
        
    	 int total = boardMapper.totalByType(pInfo);

        pInfo.setTotal(total);
        
        // 게시물 목록 조회
        List<BoardPrvc> boards = boardMapper.listByType( pInfo);
        
        Map<String,Object> res = Map.of(
        		"boards", boards,
        		"pInfo", pInfo
        		);
        System.out.println("res 데이터  확인"+res);
        return ResponseEntity.ok(res);
    }
    
    
//    /*상단공지 체크박스 체크 여부 확인*/
//    @GetMapping ("{isTop}")
//    public ResponseEntity<Map<String,Object>>
    
    
    
    /* 게시물 상세 조회*/
    @GetMapping("/detail/{boardId}")
    public ResponseEntity<BoardPrvc> getBoard(@PathVariable("boardId") int boardId) {
        BoardPrvc board = boardMapper.detail(boardId);
        
        if (board != null) {
            // 조회수 증가
            boardMapper.incrementViews(boardId);
            return ResponseEntity.ok(board);
        } else {
            return ResponseEntity.notFound().build();
        }
//        System.out.println("board 정보 확인" +board);
    }
    
    
    @PostMapping("/insertWithFile")
    public ResponseEntity<?> createBoard(
            @RequestPart("board") BoardPrvc board,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        
        // 1. 게시글 먼저 저장 (SelectKey로 ID 획득)
        boardMapper.insertKey(board);
        
        // 2. 파일 저장 로직 (로컬 디스크 저장 및 DB 기록)
        if (files != null) {
           saveFiles(board.getBoardId(),files);
        }
        return ResponseEntity.ok(Map.of("success", true,"boardId", board.getBoardId()));
    }
    
    
    @PostMapping("/updateWithFile")
    public ResponseEntity<?> updateBoardWithFile(
            @RequestPart("board") BoardPrvc board,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        
        // 1. 기본 정보 수정
        int result = boardMapper.update(board);
        
        // 2. 새 파일이 있으면 저장
        if (files != null && !files.isEmpty()) {
            saveFiles(board.getBoardId(), files);
        }
        
        return ResponseEntity.ok(Map.of("success", result > 0));
    }
    

    /*파일 다운로드*/
    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable("fileId") int fileId) {
        try {
            // DB에서 파일 정보 조회 (BoardFile 객체 반환하도록 Mapper 수정 필요)
        	System.out.println("0");
            BoardPrvc fileItem = boardMapper.getFileById(fileId); 
            System.out.println("1");
            Path filePath = Paths.get(fileItem.getSavedPath());
            System.out.println("2");
            Resource resource = new UrlResource(filePath.toUri());
            System.out.println("3");
            if (resource.exists()) {
                // 한글 파일명을 UTF-8로 인코딩
                String encodedFileName = UriUtils.encode(fileItem.getOriginName(), StandardCharsets.UTF_8);
                
                // RFC 5987 표준 방식인 filename*=UTF-8''... 형식
                String contentDisposition = "attachment; filename=\"" + encodedFileName + "\"; filename*=UTF-8''" + encodedFileName;

                return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
        	System.out.println("6");
            return ResponseEntity.internalServerError().build();
        }
    }
    
    
    
    //파일 삭제 로직
    private void delFile(String savedPath) {
    	try {
    		java.io.File file = new java.io.File(savedPath);
    		if(file.exists()) {
    			if(file.delete()) {
    				System.out.println("파일이 삭제 되었습니다."+savedPath);
    			}else {
    				System.out.println("파일이 삭제 되지 않았습니다"+savedPath);
    			}
    		}
    	}catch(Exception e) {
    		e.printStackTrace();
    	}
    }
    
    
    @DeleteMapping("/deletedFile/{fileId}")
    public ResponseEntity<?> deleteFile(@PathVariable("fileId")int fileId){
    	BoardPrvc fileItem = boardMapper.getFileById(fileId);
    	
    	if(fileItem != null) {
    		delFile(fileItem.getSavedPath());
    		
    		int result = boardMapper.deleteFile(fileId);
    		return ResponseEntity.ok(Map.of("success",result>0));
    	}
    	return ResponseEntity.notFound().build();
    }
    
    
    
    
    /* 게시물 등록*/
    @PostMapping("/Insert") //리액트 fetch 주소와 일치 시켜야함
    public ResponseEntity<Map<String, Object>> createBoard(
            @RequestBody BoardPrvc board) {
        
        int result = boardMapper.insertKey(board);
        
        Map<String, Object> response = new HashMap<>();
        if (result > 0) {
            response.put("success", true);
            response.put("boardId", board.getBoardId());
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 게시물 수정
     */
    @PutMapping("/detail/{boardId}")
    public ResponseEntity<Map<String, Object>> updateBoard(
            @PathVariable("boardId") int boardId,
            @RequestBody BoardPrvc board) {
        
        board.setBoardId(boardId);
        int result = boardMapper.update(board);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", result > 0);
        return ResponseEntity.ok(response);
    }
    
    /**게시물 삭제 */
    @DeleteMapping("/detail/{boardId}")
    public ResponseEntity<Map<String, Object>> deleteBoard(@PathVariable("boardId") int boardId) {
        int result = boardMapper.delete(boardId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", result > 0);
        return ResponseEntity.ok(response);
    }
    
//    /**
//     * 내가 쓴 게시물 조회
//     */
//    @GetMapping("/MyPosts/{userId}")
//    public ResponseEntity<Map<String,Object>> getMyBoards(
//            @PathVariable("userId") String userId,
//            @RequestParam(defaultValue = "1") int pNo,
//            @RequestParam(defaultValue = "10") int pageSize) {
//        
//    	
//    	
//        PageInfo pInfo = new PageInfo();
//        pInfo.setCurPage(pNo);
//        pInfo.setPageSize(pageSize);
//        
//        int total = boardMapper.totalByCreator(userId);
//        pInfo.setTotal(total);
//        
//        List<BoardPrvc> boards = boardMapper.listByCreator(userId, pInfo);
//        Map<String,Object>res = Map.of(
//        		"boards",boards,
//        		"pInfo",pInfo
//        		);
//        
//        return ResponseEntity.ok(res);
//    }
    @GetMapping("/MyPosts")
    public ResponseEntity<Map<String, Object>> getMyBoards(
    		@RequestParam("empSn") String empSn,
            @RequestParam(value = "pNo" ,defaultValue = "1") int pNo,
            @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    	System.out.println( "userId데이터 값 확인" +empSn);
    	

        PageInfo pInfo = new PageInfo();
        pInfo.setCurPage(pNo);
        pInfo.setPageSize(pageSize);

        // 1. 내가 쓴 전체 글 개수 조회 (모든 게시판 대상)
        int total = boardMapper.totalByCreator(empSn);
        System.out.println("조회 된 총 개수 :"+total);
        pInfo.setTotal(total);

        // 2. 내가 쓴 게시물 목록 조회 (페이징 포함)
        List<BoardPrvc> boards = boardMapper.listByCreator(empSn, pInfo);
        System.out.println("조회 된 리스트 크기 :"+boards.size());
        
        
        // 각 게시글 정보 출력
        if (!boards.isEmpty()) {
            System.out.println("--- 조회된 게시글 목록 ---");
            for (BoardPrvc board : boards) {
                System.out.println(String.format(
                    "ID: %d, 제목: %s, 게시판: %s, 작성자명: %s, 조회수: %d",
                    board.getBoardId(),
                    board.getTitle(),
                    board.getBoardType(),
                    board.getEmpNm(),
                    board.getViews()
                ));
            }
        } else {
            System.out.println("조회된 게시글이 없습니다!");
        }
        
        

        // 3. 리액트가 기대하는 구조로 Map 구성
        Map<String, Object> res = new HashMap<>();
        res.put("boards", boards);
        res.put("pInfo", pInfo);

        return ResponseEntity.ok(res);
    }
    
    
    private void saveFiles(int boardId, List<MultipartFile> files) {
        for (MultipartFile file : files) {
            String originName = file.getOriginalFilename();
            // 경로 세팅 (폴더가 실제 존재해야 함)
            String savedPath = "C:/uploads/" + System.currentTimeMillis() + "_" + originName;
            try {
                file.transferTo(new java.io.File(savedPath));
                
                // BoardFile 객체 생성 (사용하시는 필드명 확인: savePath vs savedPath)
                BoardPrvc fileDTO = new BoardPrvc();
                fileDTO.setBoardId(boardId);
                fileDTO.setOriginName(originName);
                fileDTO.setSavedPath(savedPath); // Mapper SQL의 필드명과 일치시킴
                fileDTO.setFileSize(file.getSize());
                
                boardMapper.insertFile(fileDTO);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    

    @GetMapping("/selectFile/{boardId}")
   public ResponseEntity<List<BoardPrvc>> selectFiles (@PathVariable("boardId")int boardId) {
    	List<BoardPrvc> selFile = boardMapper.selectFilesByBoardId(boardId);
    	return  ResponseEntity.ok(selFile);
}
    
    
    
    
}