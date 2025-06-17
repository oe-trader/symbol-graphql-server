import { getBuiltMesh } from '../../../../.mesh';

const handler = async (request: Request) => {
  try {
    const mesh = await getBuiltMesh();

    if (request.method === 'GET') {
      // GraphiQLまたはIntrospectionクエリの場合
      return new Response('GraphQL endpoint is ready', { status: 200 });
    }

    const body = await request.json();
    const { query, variables } = body;

    // mesh.executeを使用してコンテキストと一緒に実行
    const result = await mesh.execute(query, variables);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('GraphQL API error:', error);
    return new Response(
      JSON.stringify({
        errors: [{ message: 'Internal server error' }],
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
};

export const GET = handler;
export const POST = handler;
