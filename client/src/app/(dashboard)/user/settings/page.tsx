import SharedNotificationSettings from '@/components/SharedNotificationSettings'
import React from 'react'

export default function UserSettings() {
  return (
    <div className = "w-3/5">
      <SharedNotificationSettings
      title='User Settings'
      subtitle='Manage your user settings'
      />
    </div>
  )
}
