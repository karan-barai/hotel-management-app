import React from 'react'
import { Input } from '../ui/input'
import { Search } from 'lucide-react'

export default function SearchInput() {
  return (
    <div className='relative sm:block hidden'>
        <Search className='absolute h-4 w-4 top-3 left-4
        text-muted-foreground' />
      <Input placeholder='Serach' className='pl-10 
      bg-primary/10' />
    </div>
  )
}
