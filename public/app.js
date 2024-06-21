document.addEventListener('click', async ({ target }) => {
	if (target.dataset.type === 'remove') {
		const id = target.dataset.id

		remove(id).then(() => {
			target.closest('li').remove()
		})
	}

	if (target.dataset.type === 'edit') {
		const id = target.dataset.id
		const titleElement = target.parentNode.previousElementSibling
		const title = titleElement.textContent.trim()
		const newTitle = prompt('Введите новое название', title)

		if (newTitle) {
			await edit(newTitle, id)

			titleElement.textContent = newTitle
		}
	}
})

async function remove(id) {
	await fetch(`/${id}`, { method: 'DELETE' })
}

async function edit(newTitle, id) {
	await fetch(`/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			title: newTitle,
			id,
		}),
	})
}
