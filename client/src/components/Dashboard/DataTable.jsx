import React, { useState, useEffect, useMemo } from 'react';
import { fetchTableData } from '../../services/api';
import './DataTable.css';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DataTable = ({ filters }) => {
  const [data, setData] = useState([]);       // current page data
  const [allData, setAllData] = useState([]); // full filtered dataset
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [expandedRows, setExpandedRows] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalRecords: 0
  });

  // Load current page
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { data: tableData, total } = await fetchTableData({
          ...filters,
          page: pagination.currentPage,
          pageSize: pagination.pageSize
        });
        setData(tableData);
        setPagination(prev => ({ ...prev, totalRecords: total }));
      } catch (error) {
        console.error('Error loading table data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [filters, pagination.currentPage, pagination.pageSize]);

  // Load all filtered data for full export
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const { data: tableData } = await fetchTableData({
          ...filters,
          page: 1,
          pageSize: 1000000 // large number to fetch all
        });
        setAllData(tableData);
      } catch (error) {
        console.error(error);
      }
    };
    loadAllData();
  }, [filters]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const sortedAllData = useMemo(() => {
    if (!sortConfig.key) return allData;
    return [...allData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
  }, [allData, sortConfig]);

  const toggleRowExpand = (id) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter(rowId => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    setExpandedRows([]); // Clear expanded rows when changing pages
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPagination(prev => ({ ...prev, pageSize: newSize, currentPage: 1 }));
  };

  // Calculate summary statistics for current page
  const summary = useMemo(() => {
    if (data.length === 0) return null;
    
    return {
      totalSundaySchool: data.reduce((sum, item) => sum + (item.sunday_school || 0), 0),
      totalAdults: data.reduce((sum, item) => sum + (item.adults || 0), 0),
      totalYouth: data.reduce((sum, item) => sum + (item.youth || 0), 0),
      totalDisabled: data.reduce((sum, item) => sum + (item.diff_abled || 0), 0),
      totalAttendance: data.reduce((sum, item) => sum + (item.total_attendance || 0), 0),
      totalCollected: data.reduce((sum, item) => sum + (item.total_collection || 0), 0),
      totalBanked: data.reduce((sum, item) => sum + (item.banked || 0), 0),
      totalUnBanked: data.reduce((sum, item) => sum + (item.unbanked || 0), 0),
      avgAttendance: data.reduce((sum, item) => sum + (item.total_attendance || 0), 0) / data.length,
      avgCollection: data.reduce((sum, item) => sum + (item.total_collection || 0), 0) / data.length
    };
  }, [data]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'Ksh',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // -----------------------------
  // Excel Export Functions
  // -----------------------------
  
  const exportToExcel = (exportData, isAllPages = false) => {
    const archSelect = document.getElementById("archdeaconry");
    const archName = archSelect.options[archSelect.selectedIndex].text; 
    const parishSelect = document.getElementById("parish");
    const parishName = parishSelect.options[parishSelect.selectedIndex].text; 
    const congSelect = document.getElementById("congregation");
    const congName = congSelect.options[congSelect.selectedIndex].text; 
    
    if (!exportData.length) return;

     // Build descriptive title
    const title = `ATTENDANCE AND COLLECTION DATA FOR ARCHDEACONRY-${archName} PARISH-${parishName} CONGREGATION-${congName} FROM-${formatDate(filters?.start_date || "JAN 2024")} TO-${formatDate(filters?.end_date || new Date())}${isAllPages ? "(ALL PAGES)" : `(PAGE ${pagination.currentPage})`}`;

    const excelData = exportData.map(record => ({
      "Date": formatDate(record.sunday_date),
      "Archdeaconry": record.archdeaconry_name,
      "Parish": record.parish_name,
      "Congregation": record.congregation_name,
      "Sunday School": record.sunday_school,
      "Adults": record.adults,
      "Youth": record.youth,
      "Diff Abled": record.diff_abled,
      "Total Attendance": record.total_attendance,
      "Total Collected": record.total_collection,
      "Total Banked": record.banked,
      "Total Unbanked": record.unbanked,
      "Remarks": record.remarks
    }));

    // 🔑 Calculate totals & averages for ALL exportData (not just page data)
    const totals = {
      "Date": "SUMMARY",
      "Archdeaconry": "",
      "Parish": "",
      "Congregation": "",
      "Sunday School": exportData.reduce((sum, r) => sum + (r.sunday_school || 0), 0),
      "Adults": exportData.reduce((sum, r) => sum + (r.adults || 0), 0),
      "Youth": exportData.reduce((sum, r) => sum + (r.youth || 0), 0),
      "Diff Abled": exportData.reduce((sum, r) => sum + (r.diff_abled || 0), 0),
      "Total Attendance": exportData.reduce((sum, r) => sum + (r.total_attendance || 0), 0),
      "Total Collected": exportData.reduce((sum, r) => sum + (r.total_collection || 0), 0),
      "Total Banked": exportData.reduce((sum, r) => sum + (r.banked || 0), 0),
      "Total Unbanked": exportData.reduce((sum, r) => sum + (r.unbanked || 0), 0),
      "Remarks": `Avg Attendance: ${
        Math.round(exportData.reduce((s, r) => s + (r.total_attendance || 0), 0) / exportData.length)
      }, Avg Collection: ${
        Math.round(exportData.reduce((s, r) => s + (r.total_collection || 0), 0) / exportData.length)
      }`
    };


    excelData.push(totals);

    // Convert JSON to sheet
    const ws = XLSX.utils.json_to_sheet(excelData, { origin: "A2" }); // start after headers

    // Insert header rows manually
    XLSX.utils.sheet_add_aoa(ws, [[title.toUpperCase()]], { origin: "A1" });

     // Merge across all header columns (A1 through last column)
    const range = XLSX.utils.decode_range(ws["!ref"]);
    ws["!merges"] = ws["!merges"] || [];
    ws["!merges"].push({
      s: { r: 0, c: 0 },              // start row 0 col 0 (A1)
      e: { r: 0, c: range.e.c },      // end row 0 last column
    });

    // Generate filename
    const fname = `ARCHDEACONRY_${archName}_PARISH_${parishName}_CONGREGATION_${congName}_${formatDate(filters?.start_date || "JAN 2024")}_${formatDate(filters?.end_date || new Date())}.xlsx`;
    
    // Create workbook and export
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, fname.toUpperCase());
  };

  // Calculate total pages
  const totalPages = Math.ceil(pagination.totalRecords / pagination.pageSize);

  if (loading) {
    return <div className="loading-table">Loading data...</div>;
  }

  if (data.length === 0) {
    return <div className="no-data">No attendance records found for the selected filters</div>;
  }

  return (
    <div className="data-table-container">
      <div className="table-header">
        <h2>Attendance Records</h2>
        <div className="table-actions">
          <button onClick={() => exportToExcel(sortedData, false)}>
            Download Current Page
          </button>
          <button onClick={() => exportToExcel(sortedAllData, true)}>
            Download All Pages
          </button>
        </div>
        <div className="pagination-controls">
          <div className="page-size-selector">
            <label htmlFor="pageSize">Rows per page:</label>
            <select
              id="pageSize"
              value={pagination.pageSize}
              onChange={handlePageSizeChange}
              disabled={loading}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="page-info">
            Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1}-
            {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalRecords)} of {pagination.totalRecords}
          </div>
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="data-table">
          {/* Table header remains the same */}
          <thead>
            <tr>
              <th onClick={() => handleSort('sunday_date')}>
                Date {sortConfig.key === 'sunday_date' && (
                  sortConfig.direction === 'ascending' ? '↑' : '↓'
                )}
              </th>
              <th>Archdeaconry</th>
              <th>Parish</th>
              <th>Congregation</th>
              <th onClick={() => handleSort('sunday_school')}>
                Sunday School {sortConfig.key === 'sunday_school' && (
                  sortConfig.direction === 'ascending' ? '↑' : '↓'
                )}
              </th>
              <th onClick={() => handleSort('adults')}>
                Adults {sortConfig.key === 'adults' && (
                  sortConfig.direction === 'ascending' ? '↑' : '↓'
                )}
              </th>
              <th onClick={() => handleSort('youth')}>
                Youth {sortConfig.key === 'youth' && (
                  sortConfig.direction === 'ascending' ? '↑' : '↓'
                )}
              </th>
              <th onClick={() => handleSort('diff_abled')}>
                Diff. Abled {sortConfig.key === 'diff_abled' && (
                  sortConfig.direction === 'ascending' ? '↑' : '↓'
                )}
              </th>
              <th onClick={() => handleSort('total_attendance')}>
                Total Attendance{sortConfig.key === 'total_attendance' && (
                  sortConfig.direction === 'ascending' ? '↑' : '↓'
                )}
              </th>
              <th onClick={() => handleSort('total_collection')}>
                Total Collected {sortConfig.key === 'total_collection' && (
                  sortConfig.direction === 'ascending' ? '↑' : '↓'
                )}
              </th>
              <th onClick={() => handleSort('banked')}>
                Total Banked {sortConfig.key === 'banked' && (
                  sortConfig.direction === 'ascending' ? '↑' : '↓'
                )}
              </th>
              <th onClick={() => handleSort('unbanked')}>
                Total Unbanked
                {sortConfig.key === 'unbanked' && (
                  sortConfig.direction === 'ascending' ? '↑' : '↓'
                )}
              </th>
              <th>Remarks</th>
            </tr>
          </thead>
          
          {/* Table body remains the same */}
          <tbody>
            {sortedData.map((record) => (
              <React.Fragment key={record.id}>
                <tr onClick={() => toggleRowExpand(record.id)} className="expandable-row">
                  <td>{formatDate(record.sunday_date)}</td>
                  <td>{record.archdeaconry_name}</td>
                  <td>{record.parish_name}</td>
                  <td>{record.congregation_name}</td>
                  <td>{record.sunday_school}</td>
                  <td>{record.adults}</td>
                  <td>{record.youth}</td>
                  <td>{record.diff_abled}</td>
                  <td>{record.total_attendance}</td>
                  <td>{formatCurrency(record.total_collection)}</td>
                  <td>{formatCurrency(record.banked)}</td>
                  <td>{formatCurrency(record.unbanked)}</td>
                  <td>{record.remarks}</td>
                </tr>
                {expandedRows.includes(record.id) && (
                  <tr className="expanded-details">
                    <td colSpan="12">
                      <div className="details-content">
                        <div className="detail-item">
                          <span className="detail-label">Date:</span>
                          <span>{formatDate(record.sunday_date)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Location:</span>
                          <span>{record.archdeaconry_name} → {record.parish_name} → {record.congregation_name}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Attendance Breakdown:</span>
                          <div className="breakdown">
                            <span>Sunday School: {record.sunday_school}</span>
                            <span>Adults: {record.adults}</span>
                            <span>Youth: {record.youth}</span>
                            <span>Diff. Abled: {record.diff_abled}</span>
                            <span className="total">Total: {record.total_attendance}</span>
                          </div>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Financials:</span>
                          <div className="breakdown">
                            <span>Collected: {formatCurrency(record.total_collection)}</span>
                            <span>Banked: {formatCurrency(record.banked)}</span>
                            <span>Unbanked: {formatCurrency(record.unbanked)}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
          
          {/* Table footer remains the same */}
          {summary && (
            <tfoot>
              <tr>
                <td colSpan="4" className="summary-label">Totals:</td>
                <td>{summary.totalSundaySchool}</td>
                <td>{summary.totalAdults}</td>
                <td>{summary.totalYouth}</td>
                <td>{summary.totalDisabled}</td>
                <td>{summary.totalAttendance}</td>
                <td>{formatCurrency(summary.totalCollected)}</td>
                <td>{formatCurrency(summary.totalBanked)}</td>
                <td>{formatCurrency(summary.totalUnBanked)}</td>
                <td colSpan="3"></td>
              </tr>
              <tr>
                <td colSpan="4" className="summary-label">Averages:</td>
                <td>{Math.round(summary.totalSundaySchool / data.length)}</td>
                <td>{Math.round(summary.totalAdults / data.length)}</td>
                <td>{Math.round(summary.totalYouth / data.length)}</td>
                <td>{Math.round(summary.totalDisabled / data.length)}</td>
                <td>{Math.round(summary.avgAttendance)}</td>
                <td>{formatCurrency(summary.avgCollection)}</td>
                <td colSpan="3"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      
      {/* Pagination controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(1)}
          disabled={pagination.currentPage === 1 || loading}
        >
          « First
        </button>
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1 || loading}
        >
          ‹ Previous
        </button>
        
        {/* Page numbers */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (pagination.currentPage <= 3) {
            pageNum = i + 1;
          } else if (pagination.currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = pagination.currentPage - 2 + i;
          }
          
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={pagination.currentPage === pageNum ? 'active' : ''}
              disabled={loading}
            >
              {pageNum}
            </button>
          );
        })}
        
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === totalPages || loading}
        >
          Next ›
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={pagination.currentPage === totalPages || loading}
        >
          Last »
        </button>
      </div>
    </div>
  );
};

export default DataTable;
