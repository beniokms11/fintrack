'use client'

import BottomNav from '@/components/navigation/BottomNav'
import { useTheme } from '@/components/providers/ThemeProvider'
import { ArrowLeft, Moon, Sun, User, Globe, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { logout } from './actions'
import { useApp } from '@/components/providers/AppProvider'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { profile } = useApp()
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email)
    })
  }, [])

  const initials = profile?.full_name
    ? profile.full_name
        .trim()
        .split(/\s+/)
        .map((n: string) => n[0])
        .filter(Boolean)
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : email ? email[0].toUpperCase() : 'FT'

  interface SettingsItem {
    icon: any
    label: string
    subtitle: string
    href?: string
    action?: string
  }

  const sections: { title: string; items: SettingsItem[] }[] = [
    {
      title: 'Compte',
      items: [
        { icon: User, label: 'Profil', subtitle: 'Nom, email', href: '/settings/profile' },
        { icon: Globe, label: 'Langue', subtitle: 'Français', href: '/settings/language' },
        { icon: Shield, label: 'Sécurité', subtitle: 'Mot de passe', href: '/settings/security' },
      ],
    },
    {
      title: 'Préférences',
      items: [
        { icon: theme === 'dark' ? Moon : Sun, label: 'Mode sombre', subtitle: theme === 'dark' ? 'Activé' : 'Désactivé', action: 'toggle' },
        { icon: Bell, label: 'Notifications', subtitle: 'Bientôt disponible', action: 'chevron' },
      ],
    },
    {
      title: 'Aide',
      items: [
        { icon: HelpCircle, label: 'Centre d\'aide', subtitle: 'FAQ, Support', href: '/settings/help' },
      ],
    },
  ]

  return (
    <>
      <div className="page">
        <header className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/more" className="btn btn-icon btn-ghost"><ArrowLeft size={20} /></Link>
            <h1 className="page-title">Paramètres</h1>
          </div>
        </header>

        <div className="page-content">
          {/* User card */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 'var(--radius-full)',
              background: 'var(--color-accent)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 'var(--font-size-xl)', fontWeight: 700,
            }}>
              {initials}
            </div>
            <div>
              <span style={{ display: 'block', fontWeight: 700, fontSize: '18px' }}>{profile?.full_name || 'Utilisateur FinTrack'}</span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{email || 'Chargement...'}</span>
            </div>
          </div>

          {sections.map(section => (
            <div key={section.title}>
              <h3 style={{
                fontSize: 'var(--font-size-sm)', fontWeight: 600,
                color: 'var(--color-text-secondary)', textTransform: 'uppercase',
                letterSpacing: '0.05em', marginBottom: 'var(--space-sm)',
              }}>
                {section.title}
              </h3>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {section.items.map((item, i) => {
                  const Icon = item.icon
                  const content = (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                        background: 'var(--color-bg)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: 'var(--color-text-secondary)',
                      }}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <span style={{ display: 'block', fontWeight: 500 }}>{item.label}</span>
                        {item.subtitle && (
                          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>{item.subtitle}</span>
                        )}
                      </div>
                    </div>
                  )

                  if (item.action === 'toggle') {
                    return (
                      <div
                        key={item.label}
                        onClick={toggleTheme}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: 'var(--space-lg)', cursor: 'pointer',
                          borderBottom: i < section.items.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                        }}
                      >
                        {content}
                        <div style={{
                          width: 44, height: 24, borderRadius: 12,
                          background: theme === 'dark' ? 'var(--color-accent)' : 'var(--color-border)',
                          position: 'relative', transition: 'background var(--transition-fast)',
                        }}>
                          <div style={{
                            width: 20, height: 20, borderRadius: 10,
                            background: 'white', position: 'absolute', top: 2,
                            left: theme === 'dark' ? 22 : 2,
                            transition: 'left var(--transition-fast)',
                          }} />
                        </div>
                      </div>
                    )
                  }

                  if (item.href) {
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: 'var(--space-lg)', cursor: 'pointer', color: 'inherit', textDecoration: 'none',
                          borderBottom: i < section.items.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                        }}
                      >
                        {content}
                        <ChevronRight size={16} style={{ color: 'var(--color-text-tertiary)' }} />
                      </Link>
                    )
                  }

                  return (
                    <div
                      key={item.label}
                      onClick={() => {
                        if (item.action === 'chevron' || !item.href) {
                          alert('Cette fonctionnalité sera bientôt disponible dans la prochaine mise à jour !')
                        }
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: 'var(--space-lg)', cursor: 'pointer',
                        borderBottom: i < section.items.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                      }}
                    >EFBDQ
                      {content}
                      <ChevronRight size={16} style={{ color: 'var(--color-text-tertiary)' }} />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Logout */}
          <button onClick={() => logout()} className="btn btn-secondary" style={{ width: '100%', color: 'var(--color-expense)' }}>
            <LogOut size={16} /> Se déconnecter
          </button>

          <p style={{ textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
            FinTrack v1.0.0
          </p>
        </div>
      </div>
      <BottomNav />
    </>
  )
}
