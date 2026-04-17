import { vi } from "vitest";

type MockQueryBuilder = {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  neq: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  then: ReturnType<typeof vi.fn>;
};

function createChainableMock(resolvedValue: { data: any; error: any } = { data: null, error: null }): MockQueryBuilder {
  const chain: Partial<MockQueryBuilder> = {};

  const mockFn = () => {
    const fn = vi.fn().mockReturnValue(chain as MockQueryBuilder);
    return fn;
  };

  chain.select = mockFn();
  chain.insert = mockFn();
  chain.update = mockFn();
  chain.delete = mockFn();
  chain.eq = mockFn();
  chain.neq = mockFn();
  chain.order = mockFn();
  chain.limit = mockFn();
  chain.single = vi.fn().mockResolvedValue(resolvedValue);
  chain.then = vi.fn((onFulfilled: (v: any) => any) =>
    Promise.resolve(resolvedValue).then(onFulfilled)
  );

  return chain as MockQueryBuilder;
}

export function createMockSupabase() {
  let defaultQueryResult = { data: null, error: null };

  const from = vi.fn().mockImplementation(() => createChainableMock(defaultQueryResult));
  const rpc = vi.fn().mockResolvedValue({ data: null, error: null });
  const storage = {
    from: vi.fn().mockReturnValue({
      upload: vi.fn().mockResolvedValue({ data: null, error: null }),
      remove: vi.fn().mockResolvedValue({ data: null, error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: "https://example.com/file.png" } }),
    }),
  };

  const auth = {
    signInWithPassword: vi.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
    signUp: vi.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
    signInWithOAuth: vi.fn().mockResolvedValue({ data: null, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    resend: vi.fn().mockResolvedValue({ data: null, error: null }),
    getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
  };

  return {
    from,
    rpc,
    storage,
    auth,
    _setQueryResult: (result: { data: any; error: any }) => {
      defaultQueryResult = result;
    },
  };
}

export type MockSupabase = ReturnType<typeof createMockSupabase>;
