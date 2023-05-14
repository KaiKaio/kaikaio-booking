import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import axios from '@/utils/axios'
import { Modal, List, Input } from 'zarm';
import s from "./style.module.less";

const Books = () => {
	const [books, setBooks] = useState([])
	const [addBookName, setAddBookName] = useState('')
	const [addFormVisible, setAddFormVisible] = useState(false)

	const handleAddBook = () => {
		return new Promise((resolve, reject) => {
			axios({
				url: '/api/books/add',
				method: 'POST',
				data: { name: addBookName }
			}).then((res) => {
				const { code = 500, data = [] } = res
				if (code !== 200) {
					throw new Error()
				}
				resolve()
				setAddFormVisible(false)
				setAddBookName('')
				handleFetchBooks()
			}).catch(() => {
				reject()
			})
		})
	}

	const handleFetchBooks = () => {
		axios({
      url: '/api/books/list',
      method: 'GET'
    }).then((res) => {
      const { code = 500, data = [] } = res
      if (code !== 200) {
        return
      }
			setBooks(data)
    })
	}

	useEffect(() => {
		handleFetchBooks()
	}, [])

  return (
    <>
      <Header title="我的账本" />
      <div className={s.books}>
				{
					books.map((item) => (
						<div key={ item.id }>{ item.name }</div>
					))
				}
				<div onClick={() => setAddFormVisible(true)}>添加账本</div>

				<Modal
					visible={addFormVisible}
					title="添加账本"
					onClose={() => setAddFormVisible(false)}
					actions={[
						[
							{
								key: 'cancel',
								text: '取消',
							},
							{
								key: 'add',
								text: '添加',
								theme: 'primary',
							},
						],
					]}
					onAction={async (action) => {
						switch (action.key) {
							case 'add':
								await handleAddBook()
							default:
								setAddFormVisible(false);
								break;
						}
					}}
				>
					<List>
						<List.Item>
							<Input
								clearable
								placeholder="请输入账本名称"
								value={addBookName}
								onChange={(e) => {
									setAddBookName(e.target.value);
								}}
							/>
						</List.Item>
					</List>
				</Modal>
      </div>
    </>
  );
};

export default Books;
