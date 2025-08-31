import useUserAPI, { LOGIN_USER_KEY } from '@/hooks/useUser.ts'
import { useNavigate } from 'react-router'
import useImage from '@/hooks/useImage.ts'
import { useUserUpdateForm } from '@/hooks/form/useUserUpdateForm.ts'
import { useEffect } from 'react'
import queryClient from '@/api/queryClient.ts'

export function useSettings() {
  const { user, deleteUserMutation } = useUserAPI()
  const navigate = useNavigate()
  const { imageUploadMutation } = useImage()

  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isLoading,
    onSubmit,
    watch,
    setValue
  } = useUserUpdateForm()

  const profileImageUrl = watch('profileImageUrl')

  const handleImageUpload = async (file: File) => {
    const uploadResponse = await imageUploadMutation.mutateAsync(file.name)

    if (uploadResponse.data) {
      const { uploadUrl, accessUrl } = uploadResponse.data

      await fetch(uploadUrl, {
        method: 'PUT',
        body: file
      })

      setValue('profileImageUrl', accessUrl)
    }
  }

  const handleImageRemove = () => {
    setValue('profileImageUrl', '')
  }

  const handleConfirmDelete = async () => {
    await deleteUserMutation.mutateAsync()
    queryClient.removeQueries({ queryKey: [LOGIN_USER_KEY] })
    navigate('/login')
  }

  useEffect(() => {
    if (user) {
      setValue('nickname', user.nickname as string)
      setValue('introduction', user.introduction)
      setValue('githubUrl', user.githubUrl)
      setValue('profileImageUrl', user.profileImageUrl)
    }
  }, [])

  return {
    // User data
    user,

    // Form states
    register,
    errors,
    isLoading,
    isSubmitting,
    profileImageUrl,

    // Handlers
    handleSubmit: handleSubmit(onSubmit),
    handleImageUpload,
    handleImageRemove,
    handleConfirmDelete,

    // Loading states
    isDeleting: deleteUserMutation.isPending
  }
}
