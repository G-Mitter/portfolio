import { createElement } from 'react'
import { cleanup, createEvent, act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'

import { DemoCarousel } from '@/components/DemoCarousel'

const slides = [
  { name: 'Um', text: 'a', wide: '/a.mp4', tall: '/a2.mp4', label: 'A', href: '/projetos/um' },
  { name: 'Dois', text: 'b', wide: '/b.mp4', tall: '/b2.mp4', label: 'B' },
  { name: 'Três', text: 'c', wide: '/c.mp4', tall: '/c2.mp4', label: 'C' },
]

// O jsdom não tem matchMedia, IntersectionObserver nem vídeo que toca: damos versões de mentira.
beforeAll(() => {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia
  window.IntersectionObserver = class {
    observe() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver
  HTMLMediaElement.prototype.play = () => Promise.resolve()
  HTMLMediaElement.prototype.pause = () => {}
})
afterEach(cleanup)

const active = (c: HTMLElement) => c.querySelector('.rc-slide[data-active="true"] figcaption b')?.textContent

describe('DemoCarousel (robôs trabalhando)', () => {
  it('começa no primeiro, com link do projeto só onde existe', () => {
    const { container } = render(createElement(DemoCarousel, { slides }))
    expect(active(container)).toBe('Um')
    expect(screen.getAllByText('Ver o projeto →')).toHaveLength(1)
  })

  it('passa pela seta, pelo ponto e pelo teclado, dando a volta', () => {
    const { container } = render(createElement(DemoCarousel, { slides }))
    fireEvent.click(screen.getByLabelText('Próxima demonstração'))
    expect(active(container)).toBe('Dois')
    fireEvent.click(screen.getByLabelText('Ver demonstração: Três'))
    expect(active(container)).toBe('Três')
    fireEvent.keyDown(container.querySelector('.rc')!, { key: 'ArrowRight' })
    expect(active(container)).toBe('Um')
  })

  it('passa sozinho quando o vídeo ativo termina', () => {
    const { container } = render(createElement(DemoCarousel, { slides }))
    const videos = container.querySelectorAll('video')
    fireEvent.ended(videos[0])
    expect(active(container)).toBe('Dois')
    // um vídeo que não está ativo não manda passar
    fireEvent.ended(videos[0])
    expect(active(container)).toBe('Dois')
  })

  it('arrastar para a esquerda passa para o próximo', () => {
    const { container } = render(createElement(DemoCarousel, { slides }))
    const box = container.querySelector('.rc')!
    const pointer = (type: 'pointerDown' | 'pointerUp', x: number) => {
      const event = createEvent[type](box)
      Object.defineProperty(event, 'clientX', { value: x })
      fireEvent(box, event)
    }
    act(() => {
      pointer('pointerDown', 200)
      pointer('pointerUp', 100)
    })
    expect(active(container)).toBe('Dois')
  })
})
