import { act, render, fireEvent, screen } from '@/testing/test-utils';
import TiebreakerEditor from '../components/tiebreaker-editor';

const renderTiebreaker = (initScore: number | undefined) => {
  const displayText =
    initScore === undefined
      ? '-'
      : initScore === 0
        ? 'E'
        : initScore > 0
          ? `+${initScore}`
          : `${initScore}`;
  const { getByText } = render(<TiebreakerEditor initScore={initScore} />);
  const display = getByText(displayText, { selector: 'div' });
  const incrementButton = getByText('+', { selector: 'button' });
  const decrementButton = getByText('-', { selector: 'button' });
  return { display, incrementButton, decrementButton };
};

const expectPostTiebreakerCalledOnceWith = (value: number) => {
  vi.runAllTimers();
  expect(global.fetch).toHaveBeenCalledOnce();
  expect(global.fetch).toHaveBeenCalledWith('/tiebreaker', {
    method: 'POST',
    body: JSON.stringify({ tiebreaker_score: value }),
  });
};

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as Response),
  );
  vi.useFakeTimers();
});

describe('GIVEN: when tie break is not yet set', () => {
  test('THEN: it should have an initial display of -', () => {
    const { display } = renderTiebreaker(undefined);
    expect(display).toBeInTheDocument();
  });

  test('it should be set to E after incrementing the tiebreaker', () => {
    const { display, incrementButton } = renderTiebreaker(undefined);
    fireEvent.click(incrementButton);
    expect(display).toHaveTextContent('E');
    expectPostTiebreakerCalledOnceWith(0);
  });

  test('it should be set to E after decrementing the tiebreaker', () => {
    const { display, decrementButton } = renderTiebreaker(undefined);
    fireEvent.click(decrementButton);
    expect(display).toHaveTextContent('E');
    expectPostTiebreakerCalledOnceWith(0);
  });
});

describe('GIVEN: tie breaker has value of E', () => {
  describe('WHEN: the increment button is pressed', () => {
    test('THEN: it should set to positive integers', () => {
      const { display, incrementButton } = renderTiebreaker(0);
      fireEvent.click(incrementButton);
      expect(display).toHaveTextContent('+1');
      expectPostTiebreakerCalledOnceWith(1);
    });
  });
  describe('WHEN: the increment button is presed', () => {
    test('THEN: it should set display to negative integer', () => {
      const { display, decrementButton } = renderTiebreaker(0);
      fireEvent.click(decrementButton);
      expect(display).toHaveTextContent('-1');
      expectPostTiebreakerCalledOnceWith(-1);
    });
  });
  describe('WHEN: the buttons are pressed several time within the timeout', () => {
    test('THEN: the display updates every time', () => {
      const { display, decrementButton } = renderTiebreaker(0);
      fireEvent.click(decrementButton);
      expect(display).toHaveTextContent('-1');
      fireEvent.click(decrementButton);
      expect(display).toHaveTextContent('-2');
      fireEvent.click(decrementButton);
      expect(display).toHaveTextContent('-3');
      fireEvent.click(decrementButton);
      expect(display).toHaveTextContent('-4');
    });

    test('THEN: only a single post call is made', () => {
      const { decrementButton } = renderTiebreaker(0);
      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);
      expectPostTiebreakerCalledOnceWith(-4);
    });
  });
});

test('shows an error popup when saving the tiebreaker fails', async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
      json: () =>
        Promise.resolve({
          success: false,
          error: { message: 'Tiebreakers are locked for this tournament.' },
        }),
    } as Response),
  );

  const { incrementButton } = renderTiebreaker(0);
  fireEvent.click(incrementButton);
  await act(async () => {
    await vi.runAllTimersAsync();
  });

  expect(
    screen.getByText('Tiebreakers are locked for this tournament.'),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: /try again/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /report/i })).toBeInTheDocument();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});
