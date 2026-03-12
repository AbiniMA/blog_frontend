import React from 'react'

const stats = [
  { label: 'Posts Published', value: '2.5K+' },
  { label: 'Active Readers', value: '15K+' },
  { label: 'Contributors', value: '500+' },
]

const Count = () => {
  return (
    <section className="bg-slate-100 py-10 my-[10px]">
      <div className="mx-auto flex max-w-[1100px]  flex-wrap items-center justify-between gap-6 px-6 text-center md:flex-nowrap md:text-left">
        {stats.map((item) => (
          <div key={item.label} className="flex-1 min-w-[150px]">
            <p className="text-4xl font-bold  text-center">{item.value}</p>
            <p className="text-md my-2  text-slate-500 text-center">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Count
