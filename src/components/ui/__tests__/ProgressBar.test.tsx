import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test/utils/test-utils';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  it('should render with default props', () => {
    render(<ProgressBar value={50} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('should render with custom max value', () => {
    render(<ProgressBar value={25} max={50} />);
    
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<ProgressBar value={50} size="sm" />);
    expect(screen.getByRole('progressbar')).toHaveClass('h-1');
    
    rerender(<ProgressBar value={50} size="md" />);
    expect(screen.getByRole('progressbar')).toHaveClass('h-2');
    
    rerender(<ProgressBar value={50} size="lg" />);
    expect(screen.getByRole('progressbar')).toHaveClass('h-3');
  });

  it('should render with different colors', () => {
    const { rerender } = render(<ProgressBar value={50} color="blue" />);
    const progressBar = screen.getByRole('progressbar');
    const progressFill = progressBar.querySelector('div');
    expect(progressFill).toHaveClass('bg-blue-600');
    
    rerender(<ProgressBar value={50} color="green" />);
    const progressBar2 = screen.getByRole('progressbar');
    const progressFill2 = progressBar2.querySelector('div');
    expect(progressFill2).toHaveClass('bg-green-600');
    
    rerender(<ProgressBar value={50} color="orange" />);
    const progressBar3 = screen.getByRole('progressbar');
    const progressFill3 = progressBar3.querySelector('div');
    expect(progressFill3).toHaveClass('bg-orange-600');
    
    rerender(<ProgressBar value={50} color="red" />);
    const progressBar4 = screen.getByRole('progressbar');
    const progressFill4 = progressBar4.querySelector('div');
    expect(progressFill4).toHaveClass('bg-red-600');
  });

  it('should not show label when showLabel is false', () => {
    render(<ProgressBar value={50} showLabel={false} />);
    
    expect(screen.queryByText('50%')).not.toBeInTheDocument();
  });

  it('should clamp values between 0 and max', () => {
    const { rerender } = render(<ProgressBar value={-10} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
    
    rerender(<ProgressBar value={150} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<ProgressBar value={50} className="custom-class" />);
    
    const container = screen.getByRole('progressbar').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('should round percentage correctly', () => {
    render(<ProgressBar value={33.333} />);
    expect(screen.getByText('33%')).toBeInTheDocument();
  });
}); 