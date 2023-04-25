import React from 'react'
import Header from '@/components/Header'

import s from './style.module.less'

const About = () => {
  return <>
    <Header title='关于' />
    <div className={s.about}>
      <h2>关于项目</h2>
      <article>Kaikaio-Booking （开开记账本）</article>
    </div>
  </>
};

export default About;