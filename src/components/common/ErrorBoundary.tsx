/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Terjadi kesalahan yang tidak terduga.'
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('AUNARA ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F2E9] dark:bg-[#131F26] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#FFFDF8] dark:bg-[#1C2D36] rounded-2xl border border-[#344E5B]/15 dark:border-white/15 p-6 shadow-md text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#344E5B] dark:text-[#F7F2E9]">
                Terjadi Kendala Aplikasi
              </h2>
              <p className="text-xs text-[#344E5B]/75 dark:text-[#A9BCA6] mt-1 leading-relaxed break-words">
                {this.state.errorMessage}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#344E5B] dark:bg-[#E98F7B] hover:opacity-95 transition-opacity"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Muat Ulang Aplikasi</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
