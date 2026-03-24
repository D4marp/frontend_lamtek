'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  Button,
  Input,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';
import {
  Search,
  Shield,
  ExternalLink,
  Copy,
  CheckCircle,
  Clock,
  Box,
  Activity,
  Database,
  RefreshCw,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { formatDateTime, truncateHash } from '@/lib/utils';
import toast from 'react-hot-toast';
import { blockchainApi } from '@/lib/api';

interface BlockchainTransaction {
  id: string;
  txHash: string;
  blockNumber: number;
  action: string;
  akreditasiId: string;
  actor: string;
  timestamp: string;
  status: string;
  gasUsed: number;
}

const networkStats = {
  status: 'online',
  chainId: 1337,
  blockHeight: 12456,
  peers: 2,
  pendingTx: 3,
  avgBlockTime: 5,
  totalTransactions: 8542,
};

const getActionLabel = (action: string) => {
  const labels: Record<string, string> = {
    REGISTER_AKREDITASI: 'Register Akreditasi',
    UPDATE_STATUS: 'Update Status',
    UPLOAD_DOCUMENT: 'Upload Document',
    SUBMIT_ASESMEN: 'Submit Asesmen',
    VERIFY_DOCUMENT: 'Verify Document',
    FINALIZE_ASESMEN: 'Finalize Asesmen',
    SET_PERINGKAT: 'Set Peringkat',
  };
  return labels[action] || action;
};

const getActionVariant = (action: string) => {
  const variants: Record<string, 'primary' | 'secondary' | 'success' | 'warning'> = {
    REGISTER_AKREDITASI: 'primary',
    UPDATE_STATUS: 'warning',
    UPLOAD_DOCUMENT: 'success',
    SUBMIT_ASESMEN: 'primary',
    VERIFY_DOCUMENT: 'success',
    FINALIZE_ASESMEN: 'success',
    SET_PERINGKAT: 'success',
  };
  return variants[action] || 'secondary';
};

export default function BlockchainPage() {
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch transactions - using a general endpoint or all akreditasi
      const response = await blockchainApi.getAuditLog('all');
      const data = response.data;
      setTransactions(Array.isArray(data) ? data : data.transactions || data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data transaksi');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Disalin ke clipboard');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchTransactions();
      toast.success('Data diperbarui');
    } catch (err) {
      toast.error('Gagal memperbarui data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.txHash?.toLowerCase().includes(search.toLowerCase()) ||
      tx.akreditasiId?.toLowerCase().includes(search.toLowerCase()) ||
      tx.action?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto" />
          <p className="mt-2 text-secondary-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="mt-2 text-secondary-900 font-medium">Gagal memuat data</p>
          <p className="text-secondary-500 text-sm">{error}</p>
          <Button onClick={() => fetchTransactions()} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Blockchain</h1>
          <p className="text-secondary-500 mt-1">Monitor transaksi dan status jaringan Hyperledger Besu</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            leftIcon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          <Button leftIcon={<ExternalLink className="w-4 h-4" />}>
            Block Explorer
          </Button>
        </div>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success-100 rounded-xl">
                <Activity className="w-6 h-6 text-success-600" />
              </div>
              <div>
                <p className="text-sm text-secondary-500">Network Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                  <p className="font-semibold text-secondary-900">Online</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-xl">
              <Box className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Block Height</p>
              <p className="text-2xl font-bold text-secondary-900">#{networkStats.blockHeight.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-warning-100 rounded-xl">
              <Clock className="w-6 h-6 text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Pending Transactions</p>
              <p className="text-2xl font-bold text-secondary-900">{networkStats.pendingTx}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary-100 rounded-xl">
              <Database className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Total Transactions</p>
              <p className="text-2xl font-bold text-secondary-900">{networkStats.totalTransactions.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Network Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Informasi Jaringan" subtitle="Konfigurasi Hyperledger Besu" />
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-secondary-50 rounded-lg">
              <p className="text-sm text-secondary-500">Chain ID</p>
              <p className="text-lg font-semibold text-secondary-900 mt-1">{networkStats.chainId}</p>
            </div>
            <div className="p-4 bg-secondary-50 rounded-lg">
              <p className="text-sm text-secondary-500">Consensus</p>
              <p className="text-lg font-semibold text-secondary-900 mt-1">IBFT 2.0</p>
            </div>
            <div className="p-4 bg-secondary-50 rounded-lg">
              <p className="text-sm text-secondary-500">Connected Peers</p>
              <p className="text-lg font-semibold text-secondary-900 mt-1">{networkStats.peers} Nodes</p>
            </div>
            <div className="p-4 bg-secondary-50 rounded-lg">
              <p className="text-sm text-secondary-500">Avg Block Time</p>
              <p className="text-lg font-semibold text-secondary-900 mt-1">{networkStats.avgBlockTime}s</p>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Smart Contracts" subtitle="Deployed contracts" />
          <div className="space-y-3">
            <div className="p-3 bg-secondary-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-secondary-900">AkreditasiRegistry</span>
                <Badge variant="success" size="sm">Active</Badge>
              </div>
              <code className="text-xs text-secondary-500 mt-1 block">{truncateHash('0x5FbDB2315678afecb367f032d93F642f64180aa3', 8)}</code>
            </div>
            <div className="p-3 bg-secondary-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-secondary-900">AsesmenKecukupan</span>
                <Badge variant="success" size="sm">Active</Badge>
              </div>
              <code className="text-xs text-secondary-500 mt-1 block">{truncateHash('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', 8)}</code>
            </div>
            <div className="p-3 bg-secondary-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-secondary-900">DokumenIPFSRegistry</span>
                <Badge variant="success" size="sm">Active</Badge>
              </div>
              <code className="text-xs text-secondary-500 mt-1 block">{truncateHash('0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', 8)}</code>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Cari transaction hash, akreditasi ID, atau action..."
              leftIcon={<Search className="w-4 h-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h2 className="font-semibold text-secondary-900">Transaksi Terbaru</h2>
          <p className="text-sm text-secondary-500">Daftar transaksi blockchain terkini</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction Hash</TableHead>
              <TableHead>Block</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Akreditasi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead align="center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary-500" />
                    <code className="text-sm text-secondary-700">{truncateHash(tx.txHash, 8)}</code>
                    <button
                      onClick={() => copyToClipboard(tx.txHash)}
                      className="text-secondary-400 hover:text-secondary-600"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </TableCell>
                <TableCell>
                  {tx.status === 'confirmed' ? (
                    <span className="font-medium text-secondary-900">#{tx.blockNumber}</span>
                  ) : (
                    <span className="text-secondary-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={getActionVariant(tx.action)} size="sm">
                    {getActionLabel(tx.action)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-primary-600">{tx.akreditasiId}</span>
                </TableCell>
                <TableCell>
                  {tx.status === 'confirmed' ? (
                    <Badge variant="success" size="sm">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Confirmed
                    </Badge>
                  ) : (
                    <Badge variant="warning" size="sm">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-secondary-500">{formatDateTime(tx.timestamp)}</span>
                </TableCell>
                <TableCell align="center">
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
