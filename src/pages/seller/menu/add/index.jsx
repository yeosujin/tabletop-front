import React from 'react'
import MenuForm from '../../../../components/form/menu'

const MenuAdd = ({
    showModal,
    formData,
    image,
    onSubmit,
    onChange,
    onImageChange,
    onClose,
    isSubmitting,
}) => {
    return (
        <MenuForm
            showModal={showModal}
            formData={formData}
            image={image}
            onSubmit={onSubmit}
            onChange={onChange}
            onImageChange={onImageChange}
            onClose={onClose}
            isSubmitting={isSubmitting}
            isEditMode={false}
        />
    )
}

export default MenuAdd
