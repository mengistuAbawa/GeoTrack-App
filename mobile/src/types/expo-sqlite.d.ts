declare module 'expo-sqlite' {
  export interface SQLiteDatabase {
    execAsync(source: string): Promise<void>;
    closeAsync(): Promise<void>;
  }

  export function openDatabaseAsync(
    databaseName: string
  ): Promise<SQLiteDatabase>;
}
