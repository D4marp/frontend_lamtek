'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Select } from '@/components/ui';
import { Building2, User, Mail, Lock, Phone, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    // Step 1 - Tenant Info
    tenantName: '',
    tenantType: '',
    tenantAddress: '',
    // Step 2 - User Info
    name: '',
    email: '',
    phone: '',
    // Step 3 - Account
    password: '',
    confirmPassword: '',
  });

  const tenantTypeOptions = [
    { value: '', label: 'Pilih jenis institusi' },
    { value: 'PERGURUAN_TINGGI', label: 'Perguruan Tinggi' },
    { value: 'POLITEKNIK', label: 'Politeknik' },
    { value: 'AKADEMI', label: 'Akademi' },
    { value: 'INSTITUT', label: 'Institut' },
    { value: 'SEKOLAH_TINGGI', label: 'Sekolah Tinggi' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Password tidak cocok');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.success('Pendaftaran berhasil! Silakan cek email untuk verifikasi.');
    router.push('/login');
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.tenantName || !formData.tenantType) {
        toast.error('Lengkapi data institusi');
        return;
      }
    }
    if (step === 2) {
      if (!formData.name || !formData.email) {
        toast.error('Lengkapi data pengguna');
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">LAM Teknik</h1>
              <p className="text-primary-100 text-sm">Sistem Akreditasi</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Bergabung dengan Platform Akreditasi Modern
            </h2>
            <p className="text-primary-100 text-lg">
              Daftarkan institusi Anda dan mulai proses akreditasi dengan teknologi blockchain yang transparan dan aman.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold text-white">150+</div>
              <div className="text-primary-100">Program Studi</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-primary-100">Institusi</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-primary-100">Terverifikasi</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-primary-100">Dukungan</div>
            </div>
          </div>
        </div>

        <div className="text-primary-100 text-sm">
          &copy; 2026 LAM Teknik. Hak cipta dilindungi.
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-secondary-900">LAM Teknik</h1>
            </div>
          </div>

          <div className="mb-8">
            <Link href="/login" className="inline-flex items-center gap-2 text-secondary-500 hover:text-secondary-700 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Login
            </Link>
            <h2 className="text-2xl font-bold text-secondary-900">Daftar Akun Baru</h2>
            <p className="text-secondary-500 mt-1">Lengkapi data untuk mendaftarkan institusi</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1">
                <div className={`flex items-center gap-2 ${s <= step ? 'text-primary-600' : 'text-secondary-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    s < step ? 'bg-primary-600 text-white' : 
                    s === step ? 'bg-primary-100 text-primary-600 border-2 border-primary-600' : 
                    'bg-secondary-100 text-secondary-400'
                  }`}>
                    {s < step ? <CheckCircle className="w-5 h-5" /> : s}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {s === 1 ? 'Institusi' : s === 2 ? 'Pengguna' : 'Akun'}
                  </span>
                </div>
                {s < 3 && <div className={`h-1 mt-2 rounded ${s < step ? 'bg-primary-600' : 'bg-secondary-200'}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1 - Tenant Info */}
            {step === 1 && (
              <div className="space-y-4">
                <Input
                  label="Nama Institusi"
                  placeholder="Universitas Example"
                  value={formData.tenantName}
                  onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                  leftIcon={<Building2 className="w-4 h-4" />}
                />
                <Select
                  label="Jenis Institusi"
                  options={tenantTypeOptions}
                  value={formData.tenantType}
                  onChange={(e) => setFormData({ ...formData, tenantType: e.target.value })}
                />
                <Input
                  label="Alamat Institusi"
                  placeholder="Jl. Example No. 123, Kota"
                  value={formData.tenantAddress}
                  onChange={(e) => setFormData({ ...formData, tenantAddress: e.target.value })}
                />
              </div>
            )}

            {/* Step 2 - User Info */}
            {step === 2 && (
              <div className="space-y-4">
                <Input
                  label="Nama Lengkap"
                  placeholder="Dr. Example, M.T."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  leftIcon={<User className="w-4 h-4" />}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="email@institusi.ac.id"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  leftIcon={<Mail className="w-4 h-4" />}
                />
                <Input
                  label="Nomor Telepon"
                  placeholder="+62 812 3456 7890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  leftIcon={<Phone className="w-4 h-4" />}
                />
              </div>
            )}

            {/* Step 3 - Account */}
            {step === 3 && (
              <div className="space-y-4">
                <Input
                  label="Password"
                  type="password"
                  placeholder="Minimal 8 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  leftIcon={<Lock className="w-4 h-4" />}
                />
                <Input
                  label="Konfirmasi Password"
                  type="password"
                  placeholder="Ulangi password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  leftIcon={<Lock className="w-4 h-4" />}
                />
                <div className="p-4 bg-secondary-50 rounded-lg">
                  <p className="text-sm text-secondary-600 mb-3">Ringkasan Pendaftaran:</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary-500">Institusi:</span>
                      <span className="font-medium text-secondary-900">{formData.tenantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-500">Nama:</span>
                      <span className="font-medium text-secondary-900">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-500">Email:</span>
                      <span className="font-medium text-secondary-900">{formData.email}</span>
                    </div>
                  </div>
                </div>
                <label className="flex items-start gap-3">
                  <input type="checkbox" required className="mt-1 rounded border-secondary-300" />
                  <span className="text-sm text-secondary-600">
                    Saya menyetujui{' '}
                    <a href="#" className="text-primary-600 hover:underline">Syarat dan Ketentuan</a>
                    {' '}serta{' '}
                    <a href="#" className="text-primary-600 hover:underline">Kebijakan Privasi</a>
                  </span>
                </label>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {step > 1 && (
                <Button type="button" variant="secondary" onClick={prevStep} className="flex-1">
                  Sebelumnya
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" onClick={nextStep} className="flex-1">
                  Selanjutnya
                </Button>
              ) : (
                <Button type="submit" isLoading={isLoading} className="flex-1">
                  Daftar Sekarang
                </Button>
              )}
            </div>
          </form>

          <p className="text-center text-secondary-500 mt-6">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-primary-600 font-medium hover:underline">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
