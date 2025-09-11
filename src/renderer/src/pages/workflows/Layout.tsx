import { Loader } from 'lucide-react'
import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

export default function LayoutWorkflows() {
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-background z-[11] flex items-end overflow-auto">
            <div className='h-[calc(100vh-64px)] w-full'>
                <Suspense fallback={<Loader className='animate-spin' />}>
                    <Outlet />
                </Suspense>
            </div>
        </div>
    )
}
