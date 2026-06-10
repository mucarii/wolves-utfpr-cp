import { useEffect } from 'react'

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — Wolves UTFPR-CP` : 'Wolves UTFPR-CP'
    return () => { document.title = 'Wolves UTFPR-CP' }
  }, [title])
}
