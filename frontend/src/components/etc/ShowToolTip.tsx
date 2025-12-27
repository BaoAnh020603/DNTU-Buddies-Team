import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export default function ShowToolTip({ children, text, side }: { children: React.ReactNode; text: string; side?: 'top' | 'right' | 'bottom' | 'left' }) {
    return (
        <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side={side} className="bg-gray-400/10 backdrop-blur-md text-black border border-gray-300 shadow-sm py-3">
                {text.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </TooltipContent>
        </Tooltip>
    )
}
