import React, { useState, useEffect } from 'react';
import { fetchTransactionLedger } from '../services/apiEndpoints';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  AlertCircle,
  Download
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const STATUS_VARIANTS = {
  success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  processing: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  failed: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  cancelled: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
};

export default function TransactionTable({ darkMode }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  useEffect(() => {
    const loadLiveLedger = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetchTransactionLedger(currentPage, limit);
        setTransactions(response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
      } catch (err) {
        setError('Failed to establish transaction context sync with database nodes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLiveLedger();
  }, [currentPage, limit]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add Title
    doc.setFontSize(18);
    doc.text('AutoPay Transaction Report', 14, 22);
    
    // Add Subtitle/Date
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // Define columns
    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Date', dataKey: 'date' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Amount', dataKey: 'amount' },
      { header: 'Status', dataKey: 'status' }
    ];
    
    // Map data
    const rows = transactions.map(tx => ({
      id: `#${tx.id}`,
      date: tx.created_at ? new Date(tx.created_at).toLocaleString() : 'N/A',
      description: tx.category?.replace('_', ' ') || 'General Transaction',
      amount: `${tx.type === 'credit' ? '+' : '-'}${formatCurrency(tx.amount)}`,
      status: tx.status?.toUpperCase() || 'SUCCESS'
    }));
    
    // Generate Table
    autoTable(doc, {
      columns: columns,
      body: rows,
      startY: 40,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [24, 24, 27] }, // zinc-900 equivalent
    });
    
    // Save the PDF
    doc.save(`AutoPay_Report_${new Date().getTime()}.pdf`);
  };

  if (loading) {
    return (
      <div className={`p-16 text-center text-xs font-semibold tracking-wide border rounded-2xl animate-pulse ${
        darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-500' : 'bg-white border-zinc-200 text-zinc-400'
      }`}>
        Loading your transactions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center gap-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl text-xs font-semibold">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>Could not load your history. Please check your connection.</span>
      </div>
    );
  }

  return (
    <div className={`w-full border rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ${
      darkMode ? 'bg-zinc-950 border-zinc-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.2)]' : 'bg-white border-zinc-200/80'
    }`}>
      
      <div className="p-5 border-b border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className={`text-xs font-bold tracking-wider uppercase ${darkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>Payment History</h2>
          <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            All your transactions are up to date
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded-xl text-[11px] font-semibold ${
            darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200/60 text-zinc-600'
          }`}>
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            Recent Activity
          </div>
          
          <button 
            onClick={exportToPDF}
            disabled={transactions.length === 0}
            className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded-xl text-[11px] font-bold transition-all active:scale-[0.95] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode 
                ? 'bg-zinc-50 border-zinc-200 text-zinc-950 hover:bg-white' 
                : 'bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-[10px] font-bold tracking-wider uppercase ${
              darkMode ? 'bg-zinc-900/40 border-zinc-900 text-zinc-500' : 'bg-zinc-50 border-zinc-100 text-zinc-400'
            }`}>
              <th className="py-3 px-5 hidden sm:table-cell">ID</th>
              <th className="py-3 px-5 hidden md:table-cell">Date</th>
              <th className="py-3 px-5">Description</th>
              <th className="py-3 px-5 text-right">Amount</th>
              <th className="py-3 px-5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs font-medium ${darkMode ? 'divide-zinc-900 text-zinc-400' : 'divide-zinc-100 text-zinc-600'}`}>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-zinc-400 text-[11px]">No transactions found yet.</td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const statusStyle = STATUS_VARIANTS[tx.status?.toLowerCase()] || '';
                const isCredit = tx.type === 'credit';
                
                return (
                  <tr key={tx.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors duration-150">
                    <td className="py-3.5 px-5 font-mono text-[11px] text-zinc-400 font-semibold hidden sm:table-cell">#{tx.id}</td>
                    <td className="py-3.5 px-5 whitespace-nowrap text-zinc-400 font-mono text-[11px] hidden md:table-cell">
                      {tx.created_at ? new Date(tx.created_at).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-5 font-semibold">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                          isCredit ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-500/10 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
                        }`}>
                          {isCredit ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                        </div>
                        <div className="min-w-0">
                          <p className={`truncate capitalize ${darkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>
                            {tx.category?.replace('_', ' ') || 'General'}
                          </p>
                          <p className="md:hidden text-[10px] text-zinc-500 font-mono mt-0.5">
                            {tx.created_at ? new Date(tx.created_at).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={`py-3.5 px-5 text-right font-bold font-mono tracking-tight text-sm ${
                      isCredit ? 'text-emerald-500' : (darkMode ? 'text-white' : 'text-zinc-950')
                    }`}>
                      {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3.5 px-5 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-bold border rounded-md uppercase tracking-wider ${statusStyle}`}>
                        {tx.status || 'Success'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className={`p-4 border-t flex items-center justify-between text-[11px] font-semibold font-mono ${
        darkMode ? 'bg-zinc-950 border-zinc-900 text-zinc-500' : 'bg-zinc-50/50 border-zinc-100 text-zinc-400'
      }`}>
        <span>Page {currentPage} of {totalPages}</span>
        <div className="flex items-center gap-1.5">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer active:scale-[0.95] disabled:opacity-30 disabled:pointer-events-none ${
              darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800' : 'bg-white border-zinc-200/60 text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer active:scale-[0.95] disabled:opacity-30 disabled:pointer-events-none ${
              darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800' : 'bg-white border-zinc-200/60 text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
