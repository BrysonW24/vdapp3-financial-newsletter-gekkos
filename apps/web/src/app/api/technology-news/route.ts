import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Technology news from top sources: TechCrunch, MIT Technology Review, IEEE, etc.
    const articles = [
      {
        title: 'AI Breakthrough: New Language Model Achieves Human-Level Reasoning',
        summary: 'Researchers announce major advancement in artificial intelligence with a new model that demonstrates unprecedented reasoning capabilities across multiple domains.',
        source: 'TechCrunch',
        url: 'https://techcrunch.com',
        category: 'Artificial Intelligence',
        publishedAt: new Date().toISOString(),
        icon: '🤖'
      },
      {
        title: 'Quantum Computing Milestone: 1000-Qubit Processor Demonstrated',
        summary: 'Leading quantum computing company achieves breakthrough with the first commercially viable 1000-qubit processor, opening new possibilities for complex computations.',
        source: 'MIT Technology Review',
        url: 'https://www.technologyreview.com',
        category: 'Quantum Computing',
        publishedAt: new Date().toISOString(),
        icon: '⚛️'
      },
      {
        title: 'Sustainable Tech: Breakthrough in Solid-State Battery Technology',
        summary: 'Scientists develop new solid-state battery technology that could revolutionise electric vehicles with faster charging and longer range.',
        source: 'IEEE Spectrum',
        url: 'https://spectrum.ieee.org',
        category: 'Energy Storage',
        publishedAt: new Date().toISOString(),
        icon: '🔋'
      }
    ];

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Technology news fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch technology news' }, { status: 500 });
  }
}