document.addEventListener('click', async ({ target }) => {
	if (target.dataset.type === 'remove') {
		const id = target.dataset.id

		remove(id).then(() => {
			target.closest('li').remove()
		})
	}

	if (target.dataset.type === 'update') {
		const { titleElement, titleInput, buttons } = getElements(target)
		titleInput.value = titleElement.textContent.trim()

		toggle({
			titleElement,
			titleInput,
			buttons,
		})

		titleInput.focus()
	}

	if (target.dataset.type === 'save') {
		const { titleElement, titleInput, buttons } = getElements(target)

		const newTitle = titleInput.value

		await update(newTitle, target.dataset.id).then(
			() => (titleElement.textContent = newTitle),
		)

		toggle({
			titleElement,
			titleInput,
			buttons,
		})
	}

	if (target.dataset.type === 'cancel') {
		const { titleElement, titleInput, buttons } = getElements(target)

		toggle({
			titleElement,
			titleInput,
			buttons,
		})
	}
})

function toggle({ titleElement, titleInput, buttons }) {
	titleElement.classList.toggle('d-none')
	titleInput.classList.toggle('d-none')

	buttons[0].classList.toggle('d-none')
	buttons[1].classList.toggle('d-none')
	buttons[2].classList.toggle('d-none')
	buttons[3].classList.toggle('d-none')
}

function getElements(target) {
	const titleElement = target.closest('li').children[0]
	const titleInput = target.parentNode.previousElementSibling
	const buttons = target.parentNode.children

	return {
		titleElement,
		titleInput,
		buttons,
	}
}

async function remove(id) {
	await fetch(`/${id}`, { method: 'DELETE' })
}

async function update(newTitle, id) {
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
