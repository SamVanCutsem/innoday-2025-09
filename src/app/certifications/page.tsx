import { CertificationList } from '@/components/certifications'
import { mockCertifications } from '@/lib/mock-certifications'
import { Certification } from '@/types'

export default function CertificationsPage() {
  const handleAdd = async (data: Partial<Certification>) => {
    console.log('Adding certification:', data)
  }

  const handleEdit = async (certification: Certification) => {
    console.log('Editing certification:', certification)
  }

  const handleDelete = async (certification: Certification) => {
    console.log('Deleting certification:', certification)
  }

  const handleDuplicate = async (certification: Certification) => {
    console.log('Duplicating certification:', certification)
  }

  return (
    <div className="container mx-auto py-8">
      <CertificationList
        certifications={mockCertifications}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />
    </div>
  )
}