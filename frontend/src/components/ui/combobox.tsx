import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
    index?: number
    indexInput?: number
    options: any[]
    displayKey: string
    valueKey: string
    isDisabled?: boolean
    value?: string
    placeholder?: string
    className?: string
    onChangeValue: (questionIndex: number, indexInput: number | undefined, newType: string, setOpen: any) => void
}
export default function Combobox({ index, indexInput, options, displayKey, valueKey, value, placeholder = 'Select item...', className, isDisabled, onChangeValue }: Props) {
    const [open, setOpen] = useState(false)
    const getDisplayValue = () => {
        const selectedItem = options.find((item) => item[valueKey] === value)
        return selectedItem ? selectedItem[displayKey] : placeholder
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className={`min-w-[100px]  justify-between ${className}`} disabled={isDisabled || false}>
                    <p className="max-w-[300px]  line-clamp-1"> {getDisplayValue()}</p>

                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={`w-auto  p-1`}>
                <Command className="">
                    <CommandList className="max-h-[600px] mt-1">
                        <CommandEmpty className="text-gray-700 ">No item found...</CommandEmpty>
                        <CommandGroup className="p-0 overflow-visible ">
                            {options.map((item, idx) => {
                                return (
                                    <CommandItem
                                        key={item[valueKey] || idx}
                                        value={item[valueKey]}
                                        onSelect={(currentValue) => onChangeValue(index !== undefined ? index : -1, indexInput !== undefined ? indexInput : -1, currentValue, setOpen)}
                                    >
                                        <p className="max-w-[500px] line-clamp-1">{item[displayKey]}</p>
                                        <Check className={cn('ml-auto', value === item[valueKey] ? 'opacity-100' : 'opacity-0')} />
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
