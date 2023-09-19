import dynamic from 'next/dynamic'

const MyTest = dynamic(() => import('../components/MyTest'), {
    ssr: false
})




const Test = () => {
    return (
        <MyTest />
    )
}

export default Test