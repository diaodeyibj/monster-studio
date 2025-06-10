export async function GET(request) {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      method: 'GET',
      url: request.url,
      headers: {
        'user-agent': request.headers.get('user-agent'),
        'content-type': request.headers.get('content-type')
      },
      environment: process.env.NODE_ENV || 'unknown',
      deployment: process.env.VERCEL_ENV || 'unknown'
    }

    return new Response(JSON.stringify(health), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-session-id'
      }
    })
  } catch (error) {
    console.error('Health check error:', error)
    return new Response(JSON.stringify({ 
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-session-id'
    }
  })
} 