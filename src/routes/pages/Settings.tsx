import { Card, CardContent } from '@/components/ui/card'
import ProfileSection from '@/components/settings/ProfileSection.tsx'
import FormSection from '@/components/settings/FormSection.tsx'
import { useSettings } from '@/hooks/useSettings.ts'

export default function SettingsPage() {
  const {
    user,
    register,
    errors,
    isLoading,
    isSubmitting,
    profileImageUrl,
    handleSubmit,
    handleImageUpload,
    handleImageRemove,
    handleConfirmDelete,
    isDeleting
  } = useSettings()

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ProfileSection
                profileImageUrl={profileImageUrl}
                handleImageUpload={handleImageUpload}
                handleImageRemove={handleImageRemove}
              />

              <FormSection
                register={register}
                errors={errors}
                isLoading={isLoading}
                isSubmitting={isSubmitting}
                userEmail={user?.email}
                onSubmit={handleSubmit}
                onConfirmDelete={handleConfirmDelete}
                isDeleting={isDeleting}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
