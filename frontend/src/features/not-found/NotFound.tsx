import FuzzyText from '@/components/FuzzyText'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col gap-5 items-center justify-center h-screen text-2xl font-bold text-gray-900">
            <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover={true} color="#000">
                404
            </FuzzyText>
            <Button onClick={() => navigate(-1)}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Go Back
            </Button>
        </div>
    )
}
