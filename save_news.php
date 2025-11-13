<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$newsFile = 'assets/news.json';
$input = json_decode(file_get_contents('php://input'), true);

if ($input === null) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
    exit;
}

if (isset($input['title']) && isset($input['content']) && isset($input['date']) && isset($input['image']) && isset($input['excerpt'])) {
    
    if (!is_dir('assets')) {
        mkdir('assets', 0755, true);
    }
    
    if (!file_exists($newsFile)) {
        $currentNews = ['news' => []];
    } else {
        $jsonContent = file_get_contents($newsFile);
        $currentNews = json_decode($jsonContent, true);
        if (!$currentNews) {
            $currentNews = ['news' => []];
        }
    }
    
    $maxId = 0;
    foreach ($currentNews['news'] as $item) {
        $maxId = max($maxId, isset($item['id']) ? $item['id'] : 0);
    }
    
    $newItem = [
        'id' => $maxId + 1,
        'title' => htmlspecialchars($input['title']),
        'date' => $input['date'],
        'image' => htmlspecialchars($input['image']),
        'excerpt' => htmlspecialchars($input['excerpt']),
        'content' => htmlspecialchars($input['content'])
    ];
    
    array_unshift($currentNews['news'], $newItem);
    
    $writeResult = file_put_contents($newsFile, json_encode($currentNews, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    
    if ($writeResult !== false) {
        http_response_code(200);
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Could not write to file. Check permissions.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
}
?>