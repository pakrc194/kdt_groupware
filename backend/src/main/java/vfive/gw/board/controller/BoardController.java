package vfive.gw.board.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RestController;

import vfive.gw.board.di.PageInfo;
import vfive.gw.board.dto.BoardPrvc;
import vfive.gw.board.mapper.BoardMapper;

@RestController
@RequestMapping("/board")
@CrossOrigin(origins = "http://192.168.0.36:3000")
public class BoardController {
	
    @Autowired
    private BoardMapper boardMapper;
    
    /**
     * 게시판 목록 조회 (페이징, 검색 포함)
     */
    @GetMapping("{sideId}")
    public ResponseEntity<List> getBoards(
    		PageInfo pInfo) {
        
    	System.out.println("요청받은 게시판 아이디: " + pInfo);
        
    	 int total = boardMapper.totalByType(pInfo);

        pInfo.setTotal(total);
        
        // 게시물 목록 조회
        List<BoardPrvc> boards = boardMapper.listByType( pInfo);
        
        // 응답 데이터 구성
        //Map<String, Object> response = new HashMap<>();
        //response.put("boards", boards);
        //response.put("pInfo", pInfo);
        
        //return ResponseEntity.ok(response);
        
        return ResponseEntity.ok(boards);
    }
    
    /**
     * 게시물 상세 조회
     */
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
    }
    
    /**
     * 게시물 등록
     */
    @PostMapping("/{sideId}")
    public ResponseEntity<Map<String, Object>> createBoard(
            @PathVariable("sideId") String sideId,
            @RequestBody BoardPrvc board) {
        
        board.setBoardType(sideId);
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
    
    /**
     * 게시물 삭제
     */
    @DeleteMapping("/detail/{boardId}")
    public ResponseEntity<Map<String, Object>> deleteBoard(@PathVariable("boardId") int boardId) {
        int result = boardMapper.delete(boardId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", result > 0);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 내가 쓴 게시물 조회
     */
    @GetMapping("/my/{userId}")
    public ResponseEntity<List<BoardPrvc>> getMyBoards(
            @PathVariable("userId") String userId,
            @RequestParam(defaultValue = "1") int pNo,
            @RequestParam(defaultValue = "10") int pageSize) {
        
        PageInfo pInfo = new PageInfo();
        pInfo.setCurPage(pNo);
        pInfo.setPageSize(pageSize);
        
        List<BoardPrvc> boards = boardMapper.listByCreator(userId, pInfo);
        return ResponseEntity.ok(boards);
    }
}