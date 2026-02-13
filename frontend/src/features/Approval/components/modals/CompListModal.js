import React, { useEffect, useMemo, useState } from "react";
import Modal from "../../../../shared/components/Modal";
import "./CompListModal.css";

const CompListModal = ({
  itemList = [],
  itemNm,
  title,
  okMsg = "확인",
  onOk,
  onClose
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [keyword, setKeyword] = useState("");

  const fn_formItemSelect = (item) => {
    setSelectedItem(item);
  };

  const fn_onOk = () => {
    if (!selectedItem) return;
    onOk(selectedItem);
  };

  // 검색 필터
  const filteredList = useMemo(() => {
    if (!keyword) return itemList;
    return itemList.filter(v =>
      (v?.[itemNm] ?? "").toLowerCase().includes(keyword.toLowerCase())
    );
  }, [itemList, keyword, itemNm]);

  return (
    <Modal
      title={`${title} - ${selectedItem?.[itemNm] ?? "선택 안됨"}`}
      message={
        <div className="complist-wrap">

          {/* 검색 */}
          <div className="complist-search">
            <input
              className="complist-input"
              placeholder="검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {!!keyword && (
              <button
                className="complist-clear"
                onClick={() => setKeyword("")}
              >
                ✕
              </button>
            )}
          </div>

          {/* 리스트 */}
          <div className="complist-list">
            {filteredList.length === 0 ? (
              <div className="complist-empty">항목이 없습니다.</div>
            ) : (
              filteredList.map((v, k) => {
                const active = selectedItem?.[itemNm] === v?.[itemNm];

                return (
                  <button
                    key={k}
                    type="button"
                    className={`complist-item ${active ? "active" : ""}`}
                    onClick={() => fn_formItemSelect(v)}
                  >
                    {v?.[itemNm]}
                  </button>
                );
              })
            )}
          </div>

          {/* 안내 */}
          <div className="complist-hint">
            항목을 선택 후 {okMsg} 버튼을 눌러주세요.
          </div>

        </div>
      }
      onClose={onClose}
      onOk={fn_onOk}
      okMsg={okMsg}
      // Modal이 지원하면 ↓ 추천
      // okDisabled={!selectedItem}
    />
  );
};

export default CompListModal;
