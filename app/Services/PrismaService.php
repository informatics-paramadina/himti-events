<?php

namespace App\Services;

use Illuminate\Support\Facades\Process;

class PrismaService
{
    protected $nodePath;
    protected $prismaClientPath;

    public function __construct()
    {
        $this->nodePath = base_path('node_modules/@prisma/client');
        $this->prismaClientPath = base_path('prisma/client.js');
    }

    /**
     * Execute a Prisma query through Node.js
     * 
     * @param string $model The model name (e.g., 'event', 'participant')
     * @param string $method The method name (e.g., 'findMany', 'create')
     * @param array $params The parameters for the query
     * @return mixed
     */
    public function query($model, $method, $params = [])
    {
        $paramsJson = json_encode($params);
        
        $script = <<<JS
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        
        async function main() {
            const result = await prisma.{$model}.{$method}({$paramsJson});
            console.log(JSON.stringify(result));
        }
        
        main()
            .catch(e => {
                console.error(JSON.stringify({error: e.message}));
                process.exit(1);
            })
            .finally(async () => {
                await prisma.\$disconnect();
            });
        JS;

        $scriptPath = storage_path('app/temp_prisma_query.js');
        file_put_contents($scriptPath, $script);

        $result = Process::path(base_path())
            ->run("node {$scriptPath}");

        unlink($scriptPath);

        if ($result->failed()) {
            throw new \Exception('Prisma query failed: ' . $result->errorOutput());
        }

        return json_decode($result->output(), true);
    }

    /**
     * Find all records
     */
    public function findAll($model, $where = [], $include = [])
    {
        $params = [];
        if (!empty($where)) {
            $params['where'] = $where;
        }
        if (!empty($include)) {
            $params['include'] = $include;
        }

        return $this->query($model, 'findMany', $params);
    }

    /**
     * Find one record by ID
     */
    public function findOne($model, $id, $include = [])
    {
        $params = [
            'where' => ['id' => (int) $id]
        ];
        
        if (!empty($include)) {
            $params['include'] = $include;
        }

        return $this->query($model, 'findUnique', $params);
    }

    /**
     * Create a new record
     */
    public function create($model, $data)
    {
        return $this->query($model, 'create', [
            'data' => $data
        ]);
    }

    /**
     * Update a record
     */
    public function update($model, $id, $data)
    {
        return $this->query($model, 'update', [
            'where' => ['id' => (int) $id],
            'data' => $data
        ]);
    }

    /**
     * Delete a record
     */
    public function delete($model, $id)
    {
        return $this->query($model, 'delete', [
            'where' => ['id' => (int) $id]
        ]);
    }

    /**
     * Count records
     */
    public function count($model, $where = [])
    {
        $params = [];
        if (!empty($where)) {
            $params['where'] = $where;
        }

        return $this->query($model, 'count', $params);
    }
}
