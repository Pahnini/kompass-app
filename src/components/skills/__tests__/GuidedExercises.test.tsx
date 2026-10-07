import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import GuidedExercises from '../GuidedExercises';
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
describe('Exercise completion', () => {
  it('rewards only a completed exercise and never a cancelled or paused timer', () => {
    vi.useFakeTimers();
    const done = vi.fn();
    render(<GuidedExercises onComplete={done} />);
    fireEvent.click(screen.getByRole('button', { name: /Kurz lockern/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    act(() => {
      vi.advanceTimersByTime(20_000);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    act(() => {
      vi.advanceTimersByTime(100_000);
    });
    expect(done).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Weiter' }));
    act(() => {
      vi.advanceTimersByTime(70_000);
    });
    expect(done).toHaveBeenCalledTimes(1);
    expect(done).toHaveBeenCalledWith('exercise-release');
    act(() => {
      vi.advanceTimersByTime(50_000);
    });
    expect(done).toHaveBeenCalledTimes(1);
  });
});
