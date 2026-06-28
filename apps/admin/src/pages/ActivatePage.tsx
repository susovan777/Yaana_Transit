// Path: apps/admin/src/pages/ActivatePage.tsx
// Account activation — user clicks email link, sets password.
// Full implementation comes after layout is confirmed working.
import { Car } from 'lucide-react';

export function ActivatePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F2] p-10 w-full max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-[#1C1F26] flex items-center justify-center mx-auto mb-4">
          <Car size={22} className="text-white" />
        </div>
        <h1
          className="text-xl font-bold text-[#1C1F26] mb-2"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Activate your account
        </h1>
        <p className="text-[#6B7A90] text-sm">
          Account activation form — coming in the next build step.
        </p>
      </div>
    </div>
  );
}
