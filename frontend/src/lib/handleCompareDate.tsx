import { formatDistance } from 'date-fns'
import { enUS } from 'date-fns/locale'

const handleCompareDate = (date: Date) => {
    return formatDistance(date || new Date(), new Date(), { locale: enUS, addSuffix: true })
}

export default handleCompareDate
