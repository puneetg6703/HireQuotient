import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import { FormGroup } from 'reactstrap';

const Paginator = ({ totalPages, currentPage, changePage }) => {
  const [visibleArray] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [totalParts] = useState(new Array(Math.ceil(totalPages / 8)));
  const [currentPartIndex] = useState(
    totalParts.findIndex((it, idx) => currentPage <= (idx + 1) * 8)
  );
  const [selectedPage, setSelectedPage] = useState(null);
  const pageOptions = useMemo(
    () => buildPageSelectionOptions(totalPages, currentPage),
    [totalPages, currentPage]
  );
  const [currentVisiblePages] = useState(
    currentPartIndex === totalParts.length - 1
      ? visibleArray
          .splice(0, Math.min(totalPages - currentPartIndex * 8, 8))
          .map((it) => it + currentPartIndex * 8)
      : visibleArray.map((it) => it + currentPartIndex * 8)
  );

  function buildPageSelectionOptions(page_counts, selected_page_idx) {
    const pageSelectionOptions = [];
    for (let idx = 1; idx <= page_counts; idx++) {
      const selection_item = {
        value: idx,
        label: `Page ${idx}`
      };
      if (idx === selected_page_idx) {
        setSelectedPage(selection_item);
      }
      pageSelectionOptions.push(selection_item);
    }
    return pageSelectionOptions;
  }

  return (
    <div>
      <div data-test="datatable-pagination">
        <div className="dataTables_paginate">
          <ul data-test="pagination" className="pagination">
            <li
              data-test="page-item"
              className={`${currentPage === 1 ? 'disabled' : ''} page-item`}
              onClick={() => {
                changePage(currentPage - 1);
              }}
            >
              <a
                href="#prev"
                data-test="page-link"
                aria-label="Previous"
                className="page-link page-link"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <span>Previous</span>
              </a>
            </li>
            <>
              {totalPages > 8 ? (
                <>
                  <FormGroup style={{ width: '175px' }}>
                    <Select
                      options={pageOptions}
                      onChange={(item) => {
                        setSelectedPage(item);
                        changePage(item.value);
                      }}
                      value={selectedPage}
                      isClearable={true}
                    />
                  </FormGroup>
                </>
              ) : (
                <>
                  {currentVisiblePages.map((it, idx) => (
                    <li
                      data-test="page-item"
                      className={`${
                        it === currentPage ? 'active' : ''
                      } page-item`}
                      key={idx}
                      onClick={() => {
                        changePage(it);
                      }}
                    >
                      <a
                        href={`#${it}`}
                        data-test="page-link"
                        className="page-link page-link"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        {it}
                      </a>
                    </li>
                  ))}
                </>
              )}
            </>
            <li
              data-test="page-item"
              className={`${
                currentPage === totalPages ? 'disabled' : ''
              } page-item`}
              onClick={() => {
                changePage(currentPage + 1);
              }}
            >
              <a
                href="#next"
                data-test="page-link"
                aria-label="Next"
                className="page-link page-link"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <span>Next</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Paginator;
