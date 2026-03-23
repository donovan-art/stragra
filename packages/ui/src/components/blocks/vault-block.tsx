'use client'

import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Shield, Lock, ArrowUpRight } from 'lucide-react';

interface VaultBlockProps {
  userPlan?: 'SOLO' | 'PRO';
}

export function VaultBlock({ userPlan = 'SOLO' }: VaultBlockProps) {
  const isLocked = userPlan === 'SOLO';

  return (
    <Card className="bg-white border border-gray-200 shadow-sm relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100">
        <CardTitle className="text-gray-800 text-base font-semibold flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-500" />
          Vault
          {isLocked && (
            <span className="ml-1 text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-normal">
              Pro
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        {isLocked ? (
          /* Locked overlay */
          <div className="relative">
            {/* Ghost content behind blur */}
            <div className="space-y-2 filter blur-sm select-none pointer-events-none" aria-hidden>
              {['Google Workspace', 'Stripe Dashboard', 'AWS Console', 'QuickBooks'].map((s) => (
                <div key={s} className="flex items-center gap-3 p-2 rounded bg-gray-50">
                  <div className="w-7 h-7 rounded bg-purple-100 flex items-center justify-center">
                    <Lock className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{s}</p>
                    <p className="text-xs text-gray-400">••••••••••</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Upgrade prompt */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded">
              <div className="text-center px-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-1">Password Vault</p>
                <p className="text-xs text-gray-500 mb-3">
                  Securely store all your business passwords. Available on Pro.
                </p>
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7 px-3"
                  onClick={() => window.location.href = '/dashboard/settings?upgrade=true'}
                >
                  Upgrade to Pro
                  <ArrowUpRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Shield className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No saved passwords yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
