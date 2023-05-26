

import './App.css'

function App() {


  return (
    <>

      <h1 className='text-center font-bold text-3xl'>Vite + React</h1>
      {/* The button to open modal */}
      <label htmlFor="my-modal-3" className="btn">open modal</label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <h3 className="text-lg font-bold">Congratulations random Internet user!</h3>
          <p className="py-4">You haveve been selected for a chance to get one year of subscription to use Wikipedia for free!</p>
        </div>
      </div>

      <button className="btn btn-outline">Button</button>
      <button className="btn btn-outline btn-primary">Button</button>
      <button className="btn btn-outline btn-secondary">Button</button>
      <button className="btn btn-outline btn-accent">Button</button>


    </>
  )
}

export default App
