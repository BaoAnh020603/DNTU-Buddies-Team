import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Link } from 'react-router-dom'
import type { User } from '@/types/user'
export default function AvatarCircle({ user, className }: { user?: User; className?: string }) {
    return (
        <Tooltip>
            <TooltipTrigger>
                <div className={cn(`w-10 h-10 bg-linear-to-br from-gray-600 text-white to-gray-700/60 rounded-full flex items-center justify-center cursor-pointer relative`, className)}>
                    <div className="absolute inset-0 border-x-2 border-x-gray-300 border-y-2 border-y-gray-500 rounded-full animate-spin animation-duration-3000"></div>
                    {user?.avatar ? (
                        <img src={user?.avatar} alt={user?.displayName} className="w-9 h-9 rounded-full object-cover object-center relative z-10" />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center text-white font-medium text-lg relative z-10">
                            {user?.displayName
                                .split(' ')
                                .splice(0, 2)
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()}
                        </div>
                    )}
                </div>
            </TooltipTrigger>
            <TooltipContent className="">
                <p>{user?.displayName}</p>
                <Link to={`mailto:${user?.email}`}>{user?.email}</Link>
            </TooltipContent>
        </Tooltip>
    )
}
