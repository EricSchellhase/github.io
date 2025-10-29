<?php
header('Content-Type: application/json');

$newsFile = 'news.json';
$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['title']) && isset($input['content'])) {
    // Ensure file exists and is readable
    if (!file_exists($newsFile)) {
        $currentNews = ['news' => []];
    } else {
        $jsonContent = file_get_contents($newsFile);
        $currentNews = json_decode($jsonContent, true);
        if (!$currentNews) {
            $currentNews = ['news' => []];
        }
    }
    
    $newItem = [
        'date' => date('Y-m-d'),
        'title' => htmlspecialchars($input['title']),
        'content' => htmlspecialchars($input['content'])
    ];
    
    array_unshift($currentNews['news'], $newItem);
    
    // Save with proper formatting and error handling
    if (file_put_contents($newsFile, json_encode($currentNews, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Could not write to file']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
}
?>