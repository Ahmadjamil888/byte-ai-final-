import { NextRequest, NextResponse } from 'next/server';

// Fallback search results for common queries
const fallbackResults = [
  {
    url: 'https://tailwindui.com',
    title: 'Tailwind UI - Beautiful UI components',
    description: 'Beautiful UI components, crafted by the creators of Tailwind CSS.',
    screenshot: null,
    markdown: 'Professional UI components built with Tailwind CSS'
  },
  {
    url: 'https://ui.shadcn.com',
    title: 'shadcn/ui - Re-usable components',
    description: 'Beautifully designed components built with Radix UI and Tailwind CSS.',
    screenshot: null,
    markdown: 'Modern React components with accessibility built-in'
  },
  {
    url: 'https://stripe.com',
    title: 'Stripe - Online payment processing',
    description: 'Online payment processing for internet businesses.',
    screenshot: null,
    markdown: 'Clean, modern payment processing interface'
  },
  {
    url: 'https://linear.app',
    title: 'Linear - Issue tracking',
    description: 'The issue tracker you\'ll enjoy using.',
    screenshot: null,
    markdown: 'Minimalist project management and issue tracking'
  },
  {
    url: 'https://vercel.com',
    title: 'Vercel - Deploy web projects',
    description: 'Deploy web projects with the best frontend developer experience.',
    screenshot: null,
    markdown: 'Modern deployment platform with clean design'
  }
];

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Check if Firecrawl API key is available
    if (!process.env.FIRECRAWL_API_KEY) {
      console.error('FIRECRAWL_API_KEY not configured, using fallback results');
      return NextResponse.json({ 
        results: fallbackResults.slice(0, 5),
        fallback: true
      }, { status: 200 });
    }

    console.log('Performing search with query:', query);

    // Use Firecrawl search to get top 10 results with screenshots
    const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        limit: 10,
        scrapeOptions: {
          formats: ['markdown', 'screenshot'],
          onlyMainContent: true,
        },
      }),
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('Firecrawl API error:', searchResponse.status, errorText);
      
      // Return fallback results instead of empty array
      console.log('Using fallback search results');
      return NextResponse.json({ 
        results: fallbackResults.slice(0, 5), // Return first 5 fallback results
        fallback: true
      }, { status: 200 });
    }

    const searchData = await searchResponse.json();
    console.log('Search response received:', searchData?.data?.length || 0, 'results');
    
    // Format results with screenshots and markdown
    const results = searchData.data?.map((result: any) => ({
      url: result.url,
      title: result.title || result.url,
      description: result.description || '',
      screenshot: result.screenshot || null,
      markdown: result.markdown || '',
    })) || [];

    // If no results from API, use fallback
    if (results.length === 0) {
      console.log('No results from Firecrawl, using fallback');
      return NextResponse.json({ 
        results: fallbackResults.slice(0, 5),
        fallback: true
      });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    
    // Return fallback results instead of empty array to prevent UI breaking
    return NextResponse.json({ 
      results: fallbackResults.slice(0, 5),
      fallback: true,
      error: 'Using fallback results due to search service error'
    }, { status: 200 });
  }
}