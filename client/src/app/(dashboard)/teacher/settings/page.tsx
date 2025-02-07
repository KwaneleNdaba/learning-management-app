import SharedNotificationSettings from '@/components/SharedNotificationSettings'
import React from 'react'

export default function TeacherSettings() {
  return (
    <div className = "w-3/5">
      <SharedNotificationSettings
      title='Teacher Settings'
      subtitle='Manage your teacher settings'
      />
    </div>
  )
}
