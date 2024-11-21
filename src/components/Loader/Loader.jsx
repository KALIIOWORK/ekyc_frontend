import './Loader.scss'

const Loader = () => {
  return (
    <div
      className='fixed bg-black/70 z-30 overflow-hidden  bg-opacity-20 inset-0  flex justify-center items-center '>
      <div className='loader'>
        <div></div>
        <div></div>
        <div></div>
        <span className='relative text-red-500 text-4xl font-medium'>

          <img src=""></img>
        </span>
      </div>
    </div>
  )
}

export default Loader