import React from 'react'
import Header from '@/components/Header'
import { post } from '@/utils'

import s from './style.module.less'

const ImportBills = () => {

  const handleChangeFile = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file)

    post('/api/bill/import', formData).then((res) => {
      console.log(res)
    })
  }

  return <>
    <Header title='导入账本' />
    <div className={s.importBills}>
      <input type="file" name="file" onChange={(e) => handleChangeFile(e)} />
    </div>
  </>
};

export default ImportBills;