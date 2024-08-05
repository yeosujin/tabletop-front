import React from 'react'
import MenuForm from '../../../../components/form/menu'

const MenuModify = ({
    showModal,
    formData,
    image,
    editImageUrl,
    onSubmit,
    onChange,
    onImageChange,
    onClose,
    onDelete,
    isSubmitting,
    isDeleting,
}) => {
    return (
        <MenuForm
            showModal={showModal}
            formData={formData}
            image={image}
            editImageUrl={editImageUrl}
            onSubmit={onSubmit}
            onChange={onChange}
            onImageChange={onImageChange}
            onClose={onClose}
            onDelete={onDelete}
            isSubmitting={isSubmitting}
            isDeleting={isDeleting}
            isEditMode={true}
        />
    )
}

export default MenuModify
