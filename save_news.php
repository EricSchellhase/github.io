<?php
header('Content-Type: application/json');

$newsFile = 'assets/news.json';
$input = json_decode(file_get_contents('php://input'), true);

// Debug: Überprüfe ob Input null ist
if ($input === null) {
    echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
    exit;
}

if (isset($input['title']) && isset($input['content']) && isset($input['date']) && isset($input['image']) && isset($input['excerpt'])) {
    
    // Überprüfe ob assets Ordner existiert
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
    
    // Get the highest existing ID and increment by 1
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
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Could not write to file. Check permissions.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Missing required fields: ' . json_encode(array_keys($input ?? []))]);
}
?>