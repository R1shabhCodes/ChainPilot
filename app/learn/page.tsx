import { Metadata } from 'next';
import LearnContent from '../components/LearnContent';

export const metadata: Metadata = {
  title: 'ChainPilot — Educational Guide & How it Works',
  description: 'Learn how ChainPilot analyzes Uniswap V3 concentrated liquidity positions, range tick math, out-of-range risk, and verified Graph on-chain data.',
};

export default function LearnPage() {
  return <LearnContent />;
}
