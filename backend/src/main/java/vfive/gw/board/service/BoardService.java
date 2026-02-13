package vfive.gw.board.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vfive.gw.board.di.PageInfo;
import vfive.gw.board.dto.BoardPrvc;
import vfive.gw.board.mapper.BoardMapper;

@Service
public class BoardService {
    
    @Autowired
    private BoardMapper boardMapper;
    
    /**
     * 게시판 타입별 게시물 목록 조회
     */
//    public List<BoardPrvc> getBoardList(String boardType, PageInfo pInfo, String keyword) {
//        return boardMapper.listByType(boardType, pInfo, keyword);
//    }
//    
//    /**
//     * 게시판 타입별 전체 게시물 수 조회
//     */
//    public int getTotalCount(String boardType, String keyword) {
//        return boardMapper.totalByType(boardType, keyword);
//    }
    

    /**
     * 게시물 등록
     */
    @Transactional
    public int createBoard(BoardPrvc board) {
        return boardMapper.insertKey(board);
    }
    
    /**
     * 게시물 수정
     */
    @Transactional
    public int updateBoard(BoardPrvc board) {
        return boardMapper.update(board);
    }
    
    /**
     * 게시물 삭제
     */
    @Transactional
    public int deleteBoard(int boardId) {
        return boardMapper.delete(boardId);
    }
    
    /**
     * 작성자별 게시물 조회
     */
    public List<BoardPrvc> getMyBoards(String creator, PageInfo pInfo) {
        return boardMapper.listByCreator(creator, pInfo);
    }
    
    /**
     * 게시물 소유자 확인
     */
    public boolean isOwner(int boardId, String userId) {
        BoardPrvc board = boardMapper.detail(boardId);
        return board != null && board.getCreator().equals(userId);
    }
}