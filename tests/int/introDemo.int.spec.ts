import { createElement } from 'react'
import { act, cleanup, createEvent, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'

import { IntroDemo } from '@/components/IntroDemo'

// O jsdom não tem matchMedia: dizemos que o aparelho NÃO pediu menos movimento.
beforeAll(() => {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia
})
afterEach(cleanup)

const activeTag = (container: HTMLElement) =>
  container.querySelector('.demo-slide[data-active="true"] .demo-tag')?.textContent

// O jsdom não cria PointerEvent com clientX: montamos o evento e colocamos o clientX à mão.
function pointer(target: Element, type: 'pointerDown' | 'pointerUp', clientX: number) {
  const event = createEvent[type](target)
  Object.defineProperty(event, 'clientX', { value: clientX })
  fireEvent(target, event)
}

describe('IntroDemo (carrossel do topo)', () => {
  it('começa na Conciliação e avança pela seta', () => {
    const { container } = render(createElement(IntroDemo))
    expect(activeTag(container)).toBe('Conciliação')
    fireEvent.click(screen.getByLabelText('Próximo exemplo'))
    expect(activeTag(container)).toBe('Cadastro automatizado')
  })

  it('volta pela seta do teclado e dá a volta no começo', () => {
    const { container } = render(createElement(IntroDemo))
    fireEvent.keyDown(container.querySelector('.intro-demo')!, { key: 'ArrowLeft' })
    expect(activeTag(container)).toBe('Programação')
  })

  it('arrastar para a esquerda passa para o próximo; arrastar pouco não faz nada', () => {
    const { container } = render(createElement(IntroDemo))
    const box = container.querySelector('.intro-demo')!
    act(() => {
      pointer(box, 'pointerDown', 200)
      pointer(box, 'pointerUp', 190)
    })
    expect(activeTag(container)).toBe('Conciliação')
    act(() => {
      pointer(box, 'pointerDown', 200)
      pointer(box, 'pointerUp', 100)
    })
    expect(activeTag(container)).toBe('Cadastro automatizado')
    act(() => {
      pointer(box, 'pointerDown', 100)
      pointer(box, 'pointerUp', 200)
    })
    expect(activeTag(container)).toBe('Conciliação')
  })
})
