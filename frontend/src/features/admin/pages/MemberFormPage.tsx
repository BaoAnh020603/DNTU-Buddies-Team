import { useParams } from 'react-router-dom'
import MemberForm from '../components/MemberForm'

export default function MemberFormPage() {
    const { id } = useParams<{ id: string }>()

    return <MemberForm memberId={id} />
}
